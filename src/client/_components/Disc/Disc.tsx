import React, { Fragment, useState, useEffect } from 'react';
import { useDisc } from '../../_hooks';
import { Disc as IDisc } from '../../../lib/interfaces';
import { Link } from 'react-router-dom';

interface DiscProps {
    id: string;
}

const Disc: React.FunctionComponent<DiscProps> = props => {
    const { id } = props;
    const [disc, setDisc] = useState({} as IDisc);
    const { disc: selectedDisc, director, studio, series, publisher } = useDisc(
        id
    );

    useEffect(() => {
        setDisc(selectedDisc);
    }, [selectedDisc]);

    return (
        <Fragment>
            <div>{disc.title}</div>
            <div>{disc.format && disc.format.join(', ')}</div>
            {disc.isCollection ? <div>Collection</div> : null}
            {disc.volume ? <div>{`volume ${disc.volume}`}</div> : null}
            {director && (
                <Fragment>
                    <div>Directed by</div>
                    <Link to={`../creators/${director._id}`}>
                        {disc.director}
                    </Link>
                </Fragment>
            )}
            <div>Studio:</div>
            {studio && (
                <div>
                    {
                        <Link to={`../companies/${studio._id}`}>
                            {disc.studio}
                        </Link>
                    }
                </div>
            )}
            <div>
                {publisher && (
                    <Fragment>
                        <div>Publisher:</div>
                        <Link to={`../companies/${publisher._id}`}>
                            {disc.publisher}
                        </Link>
                    </Fragment>
                )}
            </div>
            <div>
                {series && (
                    <Link to={`../series/${series._id}`}>{disc.series}</Link>
                )}
            </div>

            <div>{`Languages: ${disc.languages &&
                disc.languages.join(', ')}`}</div>
            {disc.subtitles && disc.subtitles.length ? (
                <div>{`Subtitles: ${disc.subtitles &&
                    disc.subtitles.join(', ')}`}</div>
            ) : null}

            {disc.listPrice ? (
                <Fragment>
                    <div>List Price:</div>
                    <div>{disc.listPrice}</div>
                </Fragment>
            ) : null}
            {disc.location ? (
                <div>{`This item can be found in ${disc.location}`}</div>
            ) : null}
            {disc.physical && <div>Physical Copy Available</div>}
            {disc.digital && <div>Digital Copy Available</div>}
            {disc.image ? (
                <img
                    src={disc.image}
                    alt={`${disc.title} Cover`}
                    height="400"
                />
            ) : null}
        </Fragment>
    );
};

export default Disc;
