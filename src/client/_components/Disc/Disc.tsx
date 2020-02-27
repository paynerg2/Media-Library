import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { useDisc } from '../../_hooks';
import { Disc as IDisc } from '../../../lib/interfaces';
import Link from '../../_styled_components/link';
import { Button } from '../../_styled_components/button';
import {
    Title,
    CoverImage,
    Label,
    Staff,
    Entry,
    Details,
    Icons,
    Icon,
    Buttons
} from '../../_styled_components/displayPage';
import { discActions } from '../../_actions';
import { DiscIcons } from '../../_assets/icons';

interface DiscProps extends RouteComponentProps {
    id: string;
}

const Disc: React.FunctionComponent<DiscProps> = props => {
    const { id } = props;
    const dispatch = useDispatch();
    const [disc, setDisc] = useState({} as IDisc);
    const { disc: selectedDisc, director, studio, series, publisher } = useDisc(
        id
    );

    useEffect(() => {
        setDisc(selectedDisc);
    }, [selectedDisc]);

    const handleEdit = () => {
        props.history.push(`/discs/edit/${id}`);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${disc.title}?`)) {
            dispatch(discActions.delete(id));
            props.history.push('/');
        }
    };

    return (
        <Container>
            {disc.image ? (
                <CoverImage src={disc.image} alt={`${disc.title} Cover`} />
            ) : null}

            <Title>
                {series ? (
                    <Link to={`../series/${series._id}`}>{disc.title}</Link>
                ) : (
                    <div>{disc.title}</div>
                )}
                {disc.volume &&
                !disc.title.toLocaleLowerCase().includes('complete') ? (
                    <div>{disc.volume}</div>
                ) : null}
            </Title>

            <Staff>
                {director && (
                    <Fragment>
                        <Entry>
                            <Link to={`../creators/${director._id}`}>
                                {disc.director}
                            </Link>
                        </Entry>
                        <Label>Director</Label>
                    </Fragment>
                )}
                {studio && (
                    <Fragment>
                        <Entry>
                            <Link to={`../companies/${studio._id}`}>
                                {disc.studio}
                            </Link>
                        </Entry>
                        <Label>Studio</Label>
                    </Fragment>
                )}
            </Staff>

            <Details>
                {publisher && (
                    <Fragment>
                        <Entry>
                            <Link to={`../companies/${publisher._id}`}>
                                {disc.publisher}
                            </Link>
                        </Entry>
                        <Label>Publisher</Label>
                    </Fragment>
                )}
                {disc.location ? (
                    <Fragment>
                        <Entry>{disc.location}</Entry>
                        <Label>Location</Label>
                    </Fragment>
                ) : null}
            </Details>
            <Icons>
                {disc.physical &&
                    disc.format &&
                    disc.format.map((format: string) => (
                        <Icon
                            key={format}
                            src={DiscIcons[format]}
                            alt={format}
                        />
                    ))}
                {disc.digital && (
                    <Icon
                        src={DiscIcons.digital}
                        alt={'Digital Copy Available'}
                    />
                )}
            </Icons>

            <Buttons>
                <Button onClick={handleEdit}>EDIT</Button>
                <Button onClick={handleDelete}>DELETE</Button>
            </Buttons>
        </Container>
    );
};

export default withRouter(Disc);

const Container = styled.div`
    display: grid;
    font-family: ${props => props.theme.fonts.primary};
    background: ${props => props.theme.colors.card};
    margin: 5vh auto;

    grid-template-areas:
        'cover title title'
        'cover staff staff'
        'cover staff staff'
        'cover details details'
        'cover details details'
        'cover icons buttons';

    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: min-content 1fr 1fr 1fr 1fr min-content;

    max-height: min-content;
    max-width: calc(min(100%, 768px));
    grid-row-gap: 0px;
    grid-column-gap: 0px;
    border-radius: 8px;
    @media (max-width: 768px) {
        /* Responsive layouthere */
    }
`;
